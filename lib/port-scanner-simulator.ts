import type { PortResult, ScanSession } from "@/types/port-scanner"

const commonPorts = [
  { port: 21, service: "FTP", banners: ["220 FTP Server ready", "220 ProFTPD Server"] },
  { port: 22, service: "SSH", banners: ["SSH-2.0-OpenSSH_8.0", "SSH-2.0-libssh_0.8.7"] },
  { port: 23, service: "Telnet", banners: ["Welcome to Telnet", "Login:"] },
  { port: 25, service: "SMTP", banners: ["220 mail.example.com ESMTP", "220 Ready"] },
  { port: 53, service: "DNS", banners: ["DNS Server", "Not Available"] },
  { port: 80, service: "HTTP", banners: ["HTTP/1.1 200 OK", "Apache/2.4.41", "nginx/1.18.0"] },
  { port: 110, service: "POP3", banners: ["POP3 server ready", "+OK POP3"] },
  { port: 143, service: "IMAP", banners: ["IMAP4rev1 server ready", "* OK IMAP"] },
  { port: 443, service: "HTTPS", banners: ["HTTP/1.1 200 OK", "SSL/TLS"] },
  { port: 993, service: "IMAPS", banners: ["IMAPS ready", "* OK IMAPS"] },
  { port: 995, service: "POP3S", banners: ["POP3S ready", "+OK POP3S"] },
  { port: 1433, service: "MSSQL", banners: ["Microsoft SQL Server", "MSSQL"] },
  { port: 3306, service: "MySQL", banners: ["MySQL Server", "5.7.32-log"] },
  { port: 3389, service: "RDP", banners: ["Remote Desktop", "RDP"] },
  { port: 5432, service: "PostgreSQL", banners: ["PostgreSQL", "psql"] },
  { port: 6379, service: "Redis", banners: ["Redis server", "REDIS"] },
  { port: 8080, service: "HTTP-Alt", banners: ["HTTP/1.1 200 OK", "Jetty"] },
]

const targetIps = ["192.168.1.1", "10.0.0.1", "172.16.0.1", "192.168.0.100", "10.10.10.50", "172.20.0.25"]

export function generatePortResult(targetIp: string, port: number): PortResult {
  const commonPort = commonPorts.find((cp) => cp.port === port)
  const isOpen = Math.random() > 0.85 // 15% chance of being open

  if (isOpen && commonPort) {
    const banner = commonPort.banners[Math.floor(Math.random() * commonPort.banners.length)]
    return {
      port,
      banner,
      status: "open",
      service: commonPort.service,
      timestamp: new Date(),
      targetIp,
    }
  }

  // Random chance for filtered ports
  const status = Math.random() > 0.9 ? "filtered" : "closed"

  return {
    port,
    banner: "Not Available",
    status,
    service: undefined,
    timestamp: new Date(),
    targetIp,
  }
}

export function createScanSession(targetIp?: string, startPort?: number, endPort?: number): ScanSession {
  const ip = targetIp || targetIps[Math.floor(Math.random() * targetIps.length)]
  const start = startPort || 1
  const end = endPort || 1000

  return {
    id: crypto.randomUUID(),
    targetIp: ip,
    startPort: start,
    endPort: end,
    startTime: new Date(),
    status: "running",
    progress: 0,
    totalPorts: end - start + 1,
    scannedPorts: 0,
  }
}

export function generateStaticPortData(): PortResult[] {
  const results: PortResult[] = []
  const now = new Date()

  // Generate some historical scan data
  for (let i = 0; i < 50; i++) {
    const targetIp = targetIps[Math.floor(Math.random() * targetIps.length)]
    const commonPort = commonPorts[Math.floor(Math.random() * commonPorts.length)]
    const timestamp = new Date(now.getTime() - Math.random() * 24 * 60 * 60 * 1000)

    // Higher chance for common ports to be open in historical data
    const isOpen = Math.random() > 0.7

    if (isOpen) {
      const banner = commonPort.banners[Math.floor(Math.random() * commonPort.banners.length)]
      results.push({
        port: commonPort.port,
        banner,
        status: "open",
        service: commonPort.service,
        timestamp,
        targetIp,
      })
    }
  }

  return results.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
}
