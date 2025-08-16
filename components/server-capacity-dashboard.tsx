"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Server,
  Activity,
  Users,
  Clock,
  Zap,
  Globe,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Settings,
  BarChart3,
} from "lucide-react"
import { enhancedServerCapacity, type ServerCluster, type ServerNode } from "@/lib/enhanced-server-capacity"

interface ServerCapacityDashboardProps {
  playerName: string
  onJoinServer?: (serverId: string) => void
}

export default function ServerCapacityDashboard({ playerName, onJoinServer }: ServerCapacityDashboardProps) {
  const [clusters, setClusters] = useState<ServerCluster[]>([])
  const [globalStats, setGlobalStats] = useState<any>(null)
  const [selectedCluster, setSelectedCluster] = useState<string | null>(null)
  const [selectedTier, setSelectedTier] = useState<string>("all")

  useEffect(() => {
    // Load initial data
    updateData()

    // Update every 30 seconds
    const interval = setInterval(updateData, 30000)
    return () => clearInterval(interval)
  }, [])

  const updateData = () => {
    setClusters(enhancedServerCapacity.getClusters())
    setGlobalStats(enhancedServerCapacity.getGlobalStats())
  }

  const handleJoinServer = (serverId: string) => {
    const result = enhancedServerCapacity.joinServer(serverId, `player_${Date.now()}`, playerName)
    if (result.success) {
      onJoinServer?.(serverId)
      updateData()
    } else {
      alert(result.message)
    }
  }

  const getStatusIcon = (status: ServerNode["status"]) => {
    switch (status) {
      case "online":
        return <CheckCircle className="w-3 h-3 text-green-500" />
      case "maintenance":
        return <Settings className="w-3 h-3 text-yellow-500" />
      case "overloaded":
        return <AlertTriangle className="w-3 h-3 text-orange-500" />
      case "offline":
        return <XCircle className="w-3 h-3 text-red-500" />
    }
  }

  const getTierColor = (tier: ServerNode["tier"]) => {
    switch (tier) {
      case "standard":
        return "bg-gray-100 text-gray-800"
      case "premium":
        return "bg-blue-100 text-blue-800"
      case "ultra":
        return "bg-purple-100 text-purple-800"
      case "enterprise":
        return "bg-gold-100 text-gold-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const filteredClusters = selectedCluster ? clusters.filter((cluster) => cluster.id === selectedCluster) : clusters

  return (
    <div className="h-full flex flex-col">
      {/* Global Stats Header */}
      {globalStats && (
        <div className="p-3 bg-gradient-to-r from-green-50 to-blue-50 border-b border-gray-200">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <Server className="w-4 h-4 text-green-600" />
              <span className="font-semibold text-sm">Global Server Status</span>
            </div>
            <Badge variant="outline" className="text-green-600">
              {globalStats.onlineServers}/{globalStats.totalServers} Online
            </Badge>
          </div>
          <div className="grid grid-cols-4 gap-3 text-xs">
            <div className="text-center">
              <div className="text-gray-600">Total Capacity</div>
              <div className="font-bold text-blue-600">{globalStats.totalCapacity.toLocaleString()}</div>
            </div>
            <div className="text-center">
              <div className="text-gray-600">Current Load</div>
              <div className="font-bold text-purple-600">{globalStats.totalLoad.toLocaleString()}</div>
            </div>
            <div className="text-center">
              <div className="text-gray-600">Avg Latency</div>
              <div className="font-bold text-orange-600">{Math.round(globalStats.averageLatency)}ms</div>
            </div>
            <div className="text-center">
              <div className="text-gray-600">Queued</div>
              <div className="font-bold text-red-600">{globalStats.queuedPlayers}</div>
            </div>
          </div>
        </div>
      )}

      {/* Filters */}
      <div className="p-3 border-b border-gray-200">
        <div className="flex gap-2 mb-2">
          <select
            value={selectedCluster || "all"}
            onChange={(e) => setSelectedCluster(e.target.value === "all" ? null : e.target.value)}
            className="flex-1 text-sm border border-gray-300 rounded px-2 py-1"
          >
            <option value="all">All Regions</option>
            {clusters.map((cluster) => (
              <option key={cluster.id} value={cluster.id}>
                {cluster.name}
              </option>
            ))}
          </select>
          <select
            value={selectedTier}
            onChange={(e) => setSelectedTier(e.target.value)}
            className="text-sm border border-gray-300 rounded px-2 py-1"
          >
            <option value="all">All Tiers</option>
            <option value="standard">Standard</option>
            <option value="premium">Premium</option>
            <option value="ultra">Ultra</option>
            <option value="enterprise">Enterprise</option>
          </select>
        </div>
      </div>

      {/* Server Clusters */}
      <div className="flex-1 overflow-y-auto">
        <Tabs defaultValue="servers" className="h-full flex flex-col">
          <TabsList className="grid grid-cols-3 gap-1 h-auto p-1 mx-3 mt-2">
            <TabsTrigger value="servers" className="flex items-center gap-1 text-xs">
              <Server className="w-3 h-3" />
              Servers
            </TabsTrigger>
            <TabsTrigger value="analytics" className="flex items-center gap-1 text-xs">
              <BarChart3 className="w-3 h-3" />
              Analytics
            </TabsTrigger>
            <TabsTrigger value="queues" className="flex items-center gap-1 text-xs">
              <Clock className="w-3 h-3" />
              Queues
            </TabsTrigger>
          </TabsList>

          <TabsContent value="servers" className="flex-1 overflow-hidden mt-2">
            <div className="h-full overflow-y-auto">
              <div className="p-3 space-y-4">
                {filteredClusters.map((cluster) => (
                  <div key={cluster.id} className="border border-gray-200 rounded-lg p-3 bg-white">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <Globe className="w-4 h-4 text-blue-600" />
                        <h3 className="font-semibold text-sm">{cluster.name}</h3>
                        <Badge variant="outline" className="text-xs">
                          {cluster.nodes.filter((n) => n.status === "online").length}/{cluster.nodes.length} Online
                        </Badge>
                      </div>
                      <div className="text-xs text-gray-500">
                        Load: {Math.round((cluster.totalLoad / cluster.totalCapacity) * 100)}%
                      </div>
                    </div>

                    <div className="space-y-2">
                      {cluster.nodes
                        .filter((node) => selectedTier === "all" || node.tier === selectedTier)
                        .map((node) => (
                          <div
                            key={node.id}
                            className="flex items-center justify-between p-2 border border-gray-100 rounded bg-gray-50"
                          >
                            <div className="flex items-center gap-3 flex-1">
                              <div className="flex items-center gap-1">
                                {getStatusIcon(node.status)}
                                <span className="text-xs font-medium">{node.name}</span>
                              </div>
                              <Badge className={`text-xs px-1 py-0 ${getTierColor(node.tier)}`}>{node.tier}</Badge>
                              {node.pricePerHour && (
                                <Badge variant="outline" className="text-xs px-1 py-0">
                                  ${node.pricePerHour}/hr
                                </Badge>
                              )}
                            </div>

                            <div className="flex items-center gap-3 text-xs text-gray-500">
                              <div className="flex items-center gap-1">
                                <Users className="w-3 h-3" />
                                <span>
                                  {node.currentLoad}/{node.maxCapacity}
                                </span>
                              </div>
                              <div className="flex items-center gap-1">
                                <Activity className="w-3 h-3" />
                                <span>{Math.round(node.cpuUsage)}%</span>
                              </div>
                              <div className="flex items-center gap-1">
                                <Zap className="w-3 h-3" />
                                <span>{Math.round(node.networkLatency)}ms</span>
                              </div>
                              <Button
                                size="sm"
                                onClick={() => handleJoinServer(node.id)}
                                disabled={node.status !== "online" || node.currentLoad >= node.maxCapacity}
                                className="text-xs px-2 py-1"
                              >
                                {node.currentLoad >= node.maxCapacity ? "Full" : "Join"}
                              </Button>
                            </div>
                          </div>
                        ))}
                    </div>

                    {/* Cluster Load Bar */}
                    <div className="mt-3">
                      <div className="flex items-center justify-between text-xs mb-1">
                        <span>Cluster Load</span>
                        <span>
                          {cluster.totalLoad.toLocaleString()}/{cluster.totalCapacity.toLocaleString()}
                        </span>
                      </div>
                      <Progress value={(cluster.totalLoad / cluster.totalCapacity) * 100} className="h-2" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="analytics" className="flex-1 overflow-hidden mt-2">
            <div className="h-full overflow-y-auto p-3">
              <div className="text-center py-8 text-gray-500">
                <BarChart3 className="w-12 h-12 mx-auto mb-2 opacity-50" />
                <div className="text-sm">Server Analytics</div>
                <div className="text-xs">Real-time performance metrics and historical data</div>
                <div className="text-xs mt-2 text-blue-600">Coming soon...</div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="queues" className="flex-1 overflow-hidden mt-2">
            <div className="h-full overflow-y-auto p-3">
              <div className="text-center py-8 text-gray-500">
                <Clock className="w-12 h-12 mx-auto mb-2 opacity-50" />
                <div className="text-sm">Queue Management</div>
                <div className="text-xs">Monitor and manage server queues</div>
                <div className="text-xs mt-2 text-blue-600">Coming soon...</div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
