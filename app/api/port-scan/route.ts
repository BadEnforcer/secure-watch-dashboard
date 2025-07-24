import { type NextRequest, NextResponse } from "next/server"
import * as net from "net"

interface PortResult {
  port: number
  banner: string
  status: "open" | "closed" | "filtered"
  service?: string
  timestamp: Date
  targetIp: string
}

/**
 * Scans a single port on a target IP address to check if it's open and grabs a banner.
 */
function scanPort(targetIp: string, port: number): Promise<PortResult | null> {
  return new Promise((resolve) => {
    const socket = new net.Socket()
    socket.setTimeout(2000)

    socket.on("error", () => {
      socket.destroy()
      resolve({
        port,
        banner: "Not Available",
        status: "closed",
        timestamp: new Date(),
        targetIp,
      })
    })

    socket.on("timeout", () => {
      socket.destroy()
      resolve({
        port,
        banner: "Not Available",
        status: "filtered",
        timestamp: new Date(),
        targetIp,
      })
    })

    socket.connect(port, targetIp, () => {
      socket.write("Hello\r\n")
    })

    socket.on("data", (data) => {
      const banner = data.toString().trim()
      const service = detectService(port, banner)
      socket.destroy()
      resolve({
        port,
        banner,
        status: "open",
        service,
        timestamp: new Date(),
        targetIp,
      })
    })

    socket.on("close", (hadError) => {
      if (!hadError) {
        const service = detectService(port)
        resolve({
          port,
          banner: "Not Available",
          status: "open",
          service,
          timestamp: new Date(),
          targetIp,
        })
      }
    })
  })
}

function detectService(port: number, banner?: string): string | undefined {
  const commonServices: Record<number, string> = {
    21: "FTP",
    22: "SSH",
    23: "Telnet",
    25: "SMTP",
    53: "DNS",
    80: "HTTP",
    110: "POP3",
    143: "IMAP",
    443: "HTTPS",
    993: "IMAPS",
    995: "POP3S",
    1433: "MSSQL",
    3306: "MySQL",
    3389: "RDP",
    5432: "PostgreSQL",
    6379: "Redis",
    8080: "HTTP-Alt",
  }

  if (banner) {
    if (banner.includes("SSH")) return "SSH"
    if (banner.includes("HTTP")) return "HTTP"
    if (banner.includes("FTP")) return "FTP"
    if (banner.includes("SMTP")) return "SMTP"
    if (banner.includes("MySQL")) return "MySQL"
    if (banner.includes("PostgreSQL")) return "PostgreSQL"
  }

  return commonServices[port]
}

export async function POST(request: NextRequest) {
  try {
    const { targetIp, startPort, endPort } = await request.json()

    if (!targetIp || !startPort || !endPort) {
      return NextResponse.json({ error: "Missing required parameters: targetIp, startPort, endPort" }, { status: 400 })
    }

    const start = Number.parseInt(startPort.toString(), 10)
    const end = Number.parseInt(endPort.toString(), 10)

    if (isNaN(start) || isNaN(end) || start < 1 || end > 65535 || start > end) {
      return NextResponse.json(
        { error: "Invalid port range. Ports must be between 1-65535 and startPort <= endPort" },
        { status: 400 },
      )
    }

    // Limit scan range to prevent abuse
    if (end - start > 10000) {
      return NextResponse.json({ error: "Port range too large. Maximum 10,000 ports per scan." }, { status: 400 })
    }

    const scanPromises: Promise<PortResult | null>[] = []

    for (let port = start; port <= end; port++) {
      scanPromises.push(scanPort(targetIp, port))
    }

    const results = await Promise.all(scanPromises)
    const openPorts = results.filter((result): result is PortResult => result !== null && result.status === "open")

    return NextResponse.json({
      success: true,
      targetIp,
      startPort: start,
      endPort: end,
      totalPorts: end - start + 1,
      results: openPorts,
      scanTime: new Date().toISOString(),
    })
  } catch (error) {
    console.error("Port scan error:", error)
    return NextResponse.json({ error: "Internal server error during port scan" }, { status: 500 })
  }
}
