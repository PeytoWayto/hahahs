export interface ServerNode {
  id: string
  name: string
  region: "US-East" | "US-West" | "EU-West" | "EU-Central" | "Asia-Pacific" | "South-America"
  tier: "standard" | "premium" | "ultra" | "enterprise"
  maxCapacity: number
  currentLoad: number
  cpuUsage: number
  memoryUsage: number
  networkLatency: number
  uptime: number
  status: "online" | "maintenance" | "overloaded" | "offline"
  features: string[]
  pricePerHour?: number
  lastHealthCheck: number
}

export interface ServerCluster {
  id: string
  name: string
  region: string
  nodes: ServerNode[]
  loadBalancer: LoadBalancer
  autoScaling: AutoScalingConfig
  totalCapacity: number
  totalLoad: number
  averageLatency: number
}

export interface LoadBalancer {
  algorithm: "round-robin" | "least-connections" | "weighted" | "geographic"
  healthCheckInterval: number
  failoverEnabled: boolean
  stickySessionsEnabled: boolean
}

export interface AutoScalingConfig {
  enabled: boolean
  minNodes: number
  maxNodes: number
  scaleUpThreshold: number // CPU/Memory percentage
  scaleDownThreshold: number
  cooldownPeriod: number // minutes
}

export interface QueueSystem {
  id: string
  serverId: string
  queuedPlayers: QueuedPlayer[]
  estimatedWaitTime: number
  priorityLevels: PriorityLevel[]
  maxQueueSize: number
}

export interface QueuedPlayer {
  playerId: string
  playerName: string
  joinTime: number
  priority: "standard" | "premium" | "vip" | "developer"
  estimatedWaitTime: number
  position: number
}

export interface PriorityLevel {
  level: "standard" | "premium" | "vip" | "developer"
  multiplier: number
  maxWaitTime: number
}

export interface ServerAnalytics {
  serverId: string
  timestamp: number
  playerCount: number
  cpuUsage: number
  memoryUsage: number
  networkLatency: number
  throughput: number
  errorRate: number
  responseTime: number
}

class EnhancedServerCapacitySystem {
  private clusters: ServerCluster[] = []
  private queues: Map<string, QueueSystem> = new Map()
  private analytics: ServerAnalytics[] = []
  private globalLoadBalancer: LoadBalancer
  private monitoringInterval: NodeJS.Timeout | null = null

  constructor() {
    this.globalLoadBalancer = {
      algorithm: "geographic",
      healthCheckInterval: 30000, // 30 seconds
      failoverEnabled: true,
      stickySessionsEnabled: true,
    }
    this.initializeClusters()
    this.startMonitoring()
  }

  private initializeClusters() {
    const regions = [
      { id: "us-east", name: "US East", region: "US-East" },
      { id: "us-west", name: "US West", region: "US-West" },
      { id: "eu-west", name: "EU West", region: "EU-West" },
      { id: "eu-central", name: "EU Central", region: "EU-Central" },
      { id: "asia-pacific", name: "Asia Pacific", region: "Asia-Pacific" },
      { id: "south-america", name: "South America", region: "South-America" },
    ]

    this.clusters = regions.map((region) => ({
      id: region.id,
      name: region.name,
      region: region.region,
      nodes: this.createNodesForRegion(region.region as ServerNode["region"]),
      loadBalancer: {
        algorithm: "least-connections",
        healthCheckInterval: 15000,
        failoverEnabled: true,
        stickySessionsEnabled: false,
      },
      autoScaling: {
        enabled: true,
        minNodes: 3,
        maxNodes: 20,
        scaleUpThreshold: 80,
        scaleDownThreshold: 30,
        cooldownPeriod: 5,
      },
      totalCapacity: 0,
      totalLoad: 0,
      averageLatency: 0,
    }))

    // Calculate cluster totals
    this.updateClusterMetrics()
  }

  private createNodesForRegion(region: ServerNode["region"]): ServerNode[] {
    const baseLatency = this.getBaseLatencyForRegion(region)
    const nodes: ServerNode[] = []

    // Standard tier nodes
    for (let i = 0; i < 5; i++) {
      nodes.push({
        id: `${region.toLowerCase()}-std-${i + 1}`,
        name: `${region} Standard ${i + 1}`,
        region,
        tier: "standard",
        maxCapacity: 1000,
        currentLoad: Math.floor(Math.random() * 800) + 100,
        cpuUsage: Math.random() * 60 + 20,
        memoryUsage: Math.random() * 70 + 15,
        networkLatency: baseLatency + Math.random() * 20,
        uptime: 99.5 + Math.random() * 0.5,
        status: Math.random() > 0.95 ? "maintenance" : "online",
        features: ["basic-chat", "standard-games", "file-sharing"],
        lastHealthCheck: Date.now(),
      })
    }

    // Premium tier nodes
    for (let i = 0; i < 3; i++) {
      nodes.push({
        id: `${region.toLowerCase()}-prem-${i + 1}`,
        name: `${region} Premium ${i + 1}`,
        region,
        tier: "premium",
        maxCapacity: 2000,
        currentLoad: Math.floor(Math.random() * 1500) + 200,
        cpuUsage: Math.random() * 50 + 15,
        memoryUsage: Math.random() * 60 + 20,
        networkLatency: baseLatency + Math.random() * 10,
        uptime: 99.8 + Math.random() * 0.2,
        status: "online",
        features: ["enhanced-chat", "premium-games", "voice-chat", "custom-rooms", "priority-support"],
        pricePerHour: 0.15,
        lastHealthCheck: Date.now(),
      })
    }

    // Ultra tier nodes
    nodes.push({
      id: `${region.toLowerCase()}-ultra-1`,
      name: `${region} Ultra`,
      region,
      tier: "ultra",
      maxCapacity: 5000,
      currentLoad: Math.floor(Math.random() * 3000) + 500,
      cpuUsage: Math.random() * 40 + 10,
      memoryUsage: Math.random() * 50 + 25,
      networkLatency: baseLatency + Math.random() * 5,
      uptime: 99.95 + Math.random() * 0.05,
      status: "online",
      features: [
        "ultra-chat",
        "exclusive-games",
        "voice-chat",
        "video-chat",
        "custom-rooms",
        "priority-support",
        "dedicated-resources",
        "advanced-analytics",
      ],
      pricePerHour: 0.5,
      lastHealthCheck: Date.now(),
    })

    return nodes
  }

  private getBaseLatencyForRegion(region: ServerNode["region"]): number {
    const latencyMap = {
      "US-East": 25,
      "US-West": 35,
      "EU-West": 45,
      "EU-Central": 40,
      "Asia-Pacific": 60,
      "South-America": 80,
    }
    return latencyMap[region] || 50
  }

  private startMonitoring() {
    // Health checks and metrics updates every 30 seconds
    this.monitoringInterval = setInterval(() => {
      this.performHealthChecks()
      this.updateMetrics()
      this.processAutoScaling()
      this.updateQueues()
      this.recordAnalytics()
    }, 30000)
  }

  private performHealthChecks() {
    this.clusters.forEach((cluster) => {
      cluster.nodes.forEach((node) => {
        // Simulate health check
        const healthScore = Math.random()

        if (healthScore < 0.02) {
          node.status = "offline"
        } else if (healthScore < 0.05) {
          node.status = "maintenance"
        } else if (node.currentLoad / node.maxCapacity > 0.95) {
          node.status = "overloaded"
        } else {
          node.status = "online"
        }

        // Update metrics with some variance
        node.cpuUsage = Math.max(5, Math.min(95, node.cpuUsage + (Math.random() - 0.5) * 10))
        node.memoryUsage = Math.max(10, Math.min(90, node.memoryUsage + (Math.random() - 0.5) * 8))
        node.networkLatency = Math.max(5, node.networkLatency + (Math.random() - 0.5) * 5)
        node.currentLoad = Math.max(
          0,
          Math.min(node.maxCapacity, node.currentLoad + Math.floor((Math.random() - 0.5) * 100)),
        )
        node.lastHealthCheck = Date.now()
      })
    })
  }

  private updateMetrics() {
    this.clusters.forEach((cluster) => {
      const onlineNodes = cluster.nodes.filter((node) => node.status === "online")

      cluster.totalCapacity = onlineNodes.reduce((sum, node) => sum + node.maxCapacity, 0)
      cluster.totalLoad = onlineNodes.reduce((sum, node) => sum + node.currentLoad, 0)
      cluster.averageLatency =
        onlineNodes.length > 0
          ? onlineNodes.reduce((sum, node) => sum + node.networkLatency, 0) / onlineNodes.length
          : 0
    })
  }

  private processAutoScaling() {
    this.clusters.forEach((cluster) => {
      if (!cluster.autoScaling.enabled) return

      const onlineNodes = cluster.nodes.filter((node) => node.status === "online")
      const averageCpuUsage = onlineNodes.reduce((sum, node) => sum + node.cpuUsage, 0) / onlineNodes.length
      const averageMemoryUsage = onlineNodes.reduce((sum, node) => sum + node.memoryUsage, 0) / onlineNodes.length
      const averageLoad = (averageCpuUsage + averageMemoryUsage) / 2

      // Scale up if needed
      if (averageLoad > cluster.autoScaling.scaleUpThreshold && onlineNodes.length < cluster.autoScaling.maxNodes) {
        this.scaleUpCluster(cluster)
      }

      // Scale down if needed
      if (averageLoad < cluster.autoScaling.scaleDownThreshold && onlineNodes.length > cluster.autoScaling.minNodes) {
        this.scaleDownCluster(cluster)
      }
    })
  }

  private scaleUpCluster(cluster: ServerCluster) {
    const newNodeId = `${cluster.id}-auto-${Date.now()}`
    const newNode: ServerNode = {
      id: newNodeId,
      name: `${cluster.name} Auto ${cluster.nodes.length + 1}`,
      region: cluster.region as ServerNode["region"],
      tier: "standard",
      maxCapacity: 1000,
      currentLoad: 0,
      cpuUsage: 10,
      memoryUsage: 15,
      networkLatency: this.getBaseLatencyForRegion(cluster.region as ServerNode["region"]),
      uptime: 100,
      status: "online",
      features: ["basic-chat", "standard-games"],
      lastHealthCheck: Date.now(),
    }

    cluster.nodes.push(newNode)
    console.log(`[AutoScaling] Scaled up cluster ${cluster.name} - Added node ${newNodeId}`)
  }

  private scaleDownCluster(cluster: ServerCluster) {
    const autoNodes = cluster.nodes.filter((node) => node.id.includes("-auto-"))
    if (autoNodes.length > 0) {
      const nodeToRemove = autoNodes[autoNodes.length - 1]
      cluster.nodes = cluster.nodes.filter((node) => node.id !== nodeToRemove.id)
      console.log(`[AutoScaling] Scaled down cluster ${cluster.name} - Removed node ${nodeToRemove.id}`)
    }
  }

  private updateQueues() {
    this.queues.forEach((queue) => {
      // Update queue positions and wait times
      queue.queuedPlayers.forEach((player, index) => {
        player.position = index + 1
        player.estimatedWaitTime = this.calculateWaitTime(queue, player)
      })

      // Sort by priority
      queue.queuedPlayers.sort((a, b) => {
        const priorityOrder = { developer: 0, vip: 1, premium: 2, standard: 3 }
        const aPriority = priorityOrder[a.priority]
        const bPriority = priorityOrder[b.priority]

        if (aPriority !== bPriority) return aPriority - bPriority
        return a.joinTime - b.joinTime
      })
    })
  }

  private calculateWaitTime(queue: QueueSystem, player: QueuedPlayer): number {
    const baseWaitTime = queue.queuedPlayers.length * 30 // 30 seconds per person
    const priorityMultiplier = {
      developer: 0.1,
      vip: 0.3,
      premium: 0.6,
      standard: 1.0,
    }[player.priority]

    return Math.floor(baseWaitTime * priorityMultiplier)
  }

  private recordAnalytics() {
    this.clusters.forEach((cluster) => {
      cluster.nodes.forEach((node) => {
        if (node.status === "online") {
          this.analytics.push({
            serverId: node.id,
            timestamp: Date.now(),
            playerCount: node.currentLoad,
            cpuUsage: node.cpuUsage,
            memoryUsage: node.memoryUsage,
            networkLatency: node.networkLatency,
            throughput: Math.random() * 1000 + 500, // Simulated
            errorRate: Math.random() * 2, // Simulated
            responseTime: node.networkLatency + Math.random() * 10,
          })
        }
      })
    })

    // Keep only last 24 hours of analytics
    const oneDayAgo = Date.now() - 24 * 60 * 60 * 1000
    this.analytics = this.analytics.filter((record) => record.timestamp > oneDayAgo)
  }

  public getClusters(): ServerCluster[] {
    return [...this.clusters]
  }

  public getClusterByRegion(region: string): ServerCluster | null {
    return this.clusters.find((cluster) => cluster.region === region) || null
  }

  public getBestServerForPlayer(playerRegion?: string, tier?: ServerNode["tier"]): ServerNode | null {
    let availableNodes = this.clusters
      .flatMap((cluster) => cluster.nodes)
      .filter((node) => node.status === "online" && node.currentLoad < node.maxCapacity)

    // Filter by tier if specified
    if (tier) {
      availableNodes = availableNodes.filter((node) => node.tier === tier)
    }

    // Prefer servers in player's region
    if (playerRegion) {
      const regionalNodes = availableNodes.filter((node) => node.region === playerRegion)
      if (regionalNodes.length > 0) {
        availableNodes = regionalNodes
      }
    }

    if (availableNodes.length === 0) return null

    // Sort by load and latency
    availableNodes.sort((a, b) => {
      const aScore = (a.currentLoad / a.maxCapacity) * 0.7 + (a.networkLatency / 100) * 0.3
      const bScore = (b.currentLoad / b.maxCapacity) * 0.7 + (b.networkLatency / 100) * 0.3
      return aScore - bScore
    })

    return availableNodes[0]
  }

  public joinServer(
    serverId: string,
    playerId: string,
    playerName: string,
    priority: QueuedPlayer["priority"] = "standard",
  ): { success: boolean; message: string; queuePosition?: number } {
    const node = this.clusters.flatMap((cluster) => cluster.nodes).find((node) => node.id === serverId)

    if (!node) {
      return { success: false, message: "Server not found" }
    }

    if (node.status !== "online") {
      return { success: false, message: `Server is currently ${node.status}` }
    }

    if (node.currentLoad < node.maxCapacity) {
      node.currentLoad++
      return { success: true, message: `Successfully joined ${node.name}` }
    }

    // Server is full, add to queue
    const queueId = `queue_${serverId}`
    let queue = this.queues.get(queueId)

    if (!queue) {
      queue = {
        id: queueId,
        serverId,
        queuedPlayers: [],
        estimatedWaitTime: 0,
        priorityLevels: [
          { level: "developer", multiplier: 0.1, maxWaitTime: 60 },
          { level: "vip", multiplier: 0.3, maxWaitTime: 300 },
          { level: "premium", multiplier: 0.6, maxWaitTime: 600 },
          { level: "standard", multiplier: 1.0, maxWaitTime: 1800 },
        ],
        maxQueueSize: 500,
      }
      this.queues.set(queueId, queue)
    }

    if (queue.queuedPlayers.length >= queue.maxQueueSize) {
      return { success: false, message: "Queue is full. Please try another server." }
    }

    // Check if player is already in queue
    if (queue.queuedPlayers.some((p) => p.playerId === playerId)) {
      return { success: false, message: "You are already in the queue for this server" }
    }

    const queuedPlayer: QueuedPlayer = {
      playerId,
      playerName,
      joinTime: Date.now(),
      priority,
      estimatedWaitTime: 0,
      position: queue.queuedPlayers.length + 1,
    }

    queue.queuedPlayers.push(queuedPlayer)
    queuedPlayer.estimatedWaitTime = this.calculateWaitTime(queue, queuedPlayer)

    return {
      success: false,
      message: `Server is full. You are in queue position ${queuedPlayer.position}`,
      queuePosition: queuedPlayer.position,
    }
  }

  public leaveServer(serverId: string, playerId: string): boolean {
    const node = this.clusters.flatMap((cluster) => cluster.nodes).find((node) => node.id === serverId)

    if (node && node.currentLoad > 0) {
      node.currentLoad--

      // Process queue if available
      const queue = this.queues.get(`queue_${serverId}`)
      if (queue && queue.queuedPlayers.length > 0) {
        const nextPlayer = queue.queuedPlayers.shift()
        if (nextPlayer && node.currentLoad < node.maxCapacity) {
          node.currentLoad++
          // In a real system, you'd notify the queued player
        }
      }

      return true
    }

    return false
  }

  public getServerAnalytics(serverId: string, hours = 24): ServerAnalytics[] {
    const cutoff = Date.now() - hours * 60 * 60 * 1000
    return this.analytics.filter((record) => record.serverId === serverId && record.timestamp > cutoff)
  }

  public getGlobalStats() {
    const allNodes = this.clusters.flatMap((cluster) => cluster.nodes)
    const onlineNodes = allNodes.filter((node) => node.status === "online")

    return {
      totalServers: allNodes.length,
      onlineServers: onlineNodes.length,
      totalCapacity: onlineNodes.reduce((sum, node) => sum + node.maxCapacity, 0),
      totalLoad: onlineNodes.reduce((sum, node) => sum + node.currentLoad, 0),
      averageLatency: onlineNodes.reduce((sum, node) => sum + node.networkLatency, 0) / onlineNodes.length,
      averageCpuUsage: onlineNodes.reduce((sum, node) => sum + node.cpuUsage, 0) / onlineNodes.length,
      averageMemoryUsage: onlineNodes.reduce((sum, node) => sum + node.memoryUsage, 0) / onlineNodes.length,
      queuedPlayers: Array.from(this.queues.values()).reduce((sum, queue) => sum + queue.queuedPlayers.length, 0),
    }
  }

  public getQueueStatus(serverId: string): QueueSystem | null {
    return this.queues.get(`queue_${serverId}`) || null
  }

  private updateClusterMetrics() {
    this.clusters.forEach((cluster) => {
      const onlineNodes = cluster.nodes.filter((node) => node.status === "online")
      cluster.totalCapacity = onlineNodes.reduce((sum, node) => sum + node.maxCapacity, 0)
      cluster.totalLoad = onlineNodes.reduce((sum, node) => sum + node.currentLoad, 0)
      cluster.averageLatency =
        onlineNodes.length > 0
          ? onlineNodes.reduce((sum, node) => sum + node.networkLatency, 0) / onlineNodes.length
          : 0
    })
  }

  public destroy() {
    if (this.monitoringInterval) {
      clearInterval(this.monitoringInterval)
      this.monitoringInterval = null
    }
  }
}

// Global singleton instance
export const enhancedServerCapacity = new EnhancedServerCapacitySystem()

// Auto-start the system
if (typeof window !== "undefined") {
  // System is already initialized in constructor
}
