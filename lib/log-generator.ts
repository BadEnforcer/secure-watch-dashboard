import type { LogEntry, LogLevel, ThreatCategory } from "@/types/log"

const logLevels: LogLevel[] = ["INFO", "WARNING", "ERROR", "CRITICAL", "DEBUG"]

const threatMessages: Record<ThreatCategory, string[]> = {
  Authentication: [
    "User login successful",
    "Failed login attempt detected",
    "Multi-factor authentication bypass attempt",
    "Password brute-force attack detected",
    "Suspicious login from new location",
  ],
  "Network Security": [
    "Firewall breached",
    "DDoS attack detected",
    "Port scan detected",
    "Unusual network traffic pattern",
    "VPN connection established",
  ],
  "Malware Detection": [
    "Malware signature detected",
    "Ransomware activity blocked",
    "Trojan horse identified",
    "Suspicious file execution prevented",
    "Virus quarantined successfully",
  ],
  "System Events": [
    "System rebooted",
    "Service restart detected",
    "Memory usage critical",
    "Disk space low warning",
    "System update completed",
  ],
  "Access Control": [
    "Unauthorized access attempt",
    "Privilege escalation detected",
    "File access violation",
    "Admin rights requested",
    "Security policy violation",
  ],
}

const severityMap: Record<LogLevel, number> = {
  DEBUG: 1,
  INFO: 2,
  WARNING: 3,
  ERROR: 4,
  CRITICAL: 5,
}

export function generateLogEntry(): LogEntry {
  const categories = Object.keys(threatMessages) as ThreatCategory[]
  const category = categories[Math.floor(Math.random() * categories.length)]
  const level = logLevels[Math.floor(Math.random() * logLevels.length)]
  const messages = threatMessages[category]
  const message = messages[Math.floor(Math.random() * messages.length)]

  return {
    id: crypto.randomUUID(),
    timestamp: new Date(),
    level,
    message,
    category,
    severity: severityMap[level],
  }
}

export function parseLogString(logString: string): LogEntry | null {
  const regex = /^(\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z) \[(\w+)\] - (.+)$/
  const match = logString.match(regex)

  if (!match) return null

  const [, timestamp, level, message] = match
  const categories = Object.keys(threatMessages) as ThreatCategory[]

  // Determine category based on message content
  let category: ThreatCategory = "System Events"
  for (const cat of categories) {
    if (threatMessages[cat].some((msg) => message.includes(msg))) {
      category = cat
      break
    }
  }

  return {
    id: crypto.randomUUID(),
    timestamp: new Date(timestamp),
    level: level as LogLevel,
    message,
    category,
    severity: severityMap[level as LogLevel] || 1,
  }
}

export function generateStaticData(): LogEntry[] {
  const logs: LogEntry[] = []
  const now = new Date()
  const twentyFourHoursAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000)

  // Generate logs for the past 24 hours with varying frequency
  for (let time = twentyFourHoursAgo.getTime(); time <= now.getTime(); time += Math.random() * 300000 + 60000) {
    // Random interval between 1-5 minutes
    const logTime = new Date(time)

    // Simulate different activity patterns throughout the day
    const hour = logTime.getHours()
    let logCount = 1

    // More activity during business hours (9-17) and late night attacks (22-2)
    if ((hour >= 9 && hour <= 17) || hour >= 22 || hour <= 2) {
      logCount = Math.floor(Math.random() * 3) + 1
    }

    // Generate multiple logs for this time period
    for (let i = 0; i < logCount; i++) {
      const categories = Object.keys(threatMessages) as ThreatCategory[]
      const category = categories[Math.floor(Math.random() * categories.length)]

      // Adjust log level probability based on time of day
      let levelWeights: Record<LogLevel, number> = {
        DEBUG: 0.3,
        INFO: 0.4,
        WARNING: 0.2,
        ERROR: 0.08,
        CRITICAL: 0.02,
      }

      // More critical events during typical attack hours
      if (hour >= 22 || hour <= 2) {
        levelWeights = {
          DEBUG: 0.1,
          INFO: 0.3,
          WARNING: 0.3,
          ERROR: 0.2,
          CRITICAL: 0.1,
        }
      }

      // Select level based on weights
      const rand = Math.random()
      let cumulative = 0
      let selectedLevel: LogLevel = "INFO"

      for (const [level, weight] of Object.entries(levelWeights)) {
        cumulative += weight
        if (rand <= cumulative) {
          selectedLevel = level as LogLevel
          break
        }
      }

      const messages = threatMessages[category]
      const message = messages[Math.floor(Math.random() * messages.length)]

      logs.push({
        id: crypto.randomUUID(),
        timestamp: new Date(logTime.getTime() + i * 1000), // Spread logs within the minute
        level: selectedLevel,
        message,
        category,
        severity: severityMap[selectedLevel],
      })
    }
  }

  return logs.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
}
