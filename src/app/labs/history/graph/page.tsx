"use client";

import { useEffect, useState } from "react";
import {
  GraphCanvas,
  GraphNode,
  GraphEdge,
  NodePositionArgs,
  InternalGraphPosition
} from "reagraph";

interface BackendNode {
  id: string;
  label: string;
  level: number;
  labId: string;
}

interface BackendEdge {
  from: string;
  to: string;
}

interface LabGraphNode extends GraphNode {
  labId: string;
}

export default function LabHistoryGraph() {
  const [nodes, setNodes] = useState<LabGraphNode[]>([]);
  const [edges, setEdges] = useState<GraphEdge[]>([]);

  useEffect(() => {
    fetch("http://localhost:3000/lab/dependencies/graph")
      .then((res) => res.json())
      .then((data) => {
        const mappedNodes: LabGraphNode[] = data.nodes.map((n: BackendNode) => ({
          id: n.id,
          label: n.label,
          subLabel: `Level ${n.level}`,
          fill: getLevelColor(n.level),
          labId: n.labId || n.id.split("-")[0] // fallback if labId is not provided
        }));

        const mappedEdges: GraphEdge[] = data.edges.map((e: BackendEdge) => ({
          source: e.from,
          target: e.to,
          id: `${e.from}-${e.to}`,
          label: `${e.from}-${e.to}`
        }));

        setNodes(mappedNodes);
        setEdges(mappedEdges);

        console.log("Graph data loaded:", { nodes: mappedNodes, edges: mappedEdges, data });
      })
      .catch(console.error);
  }, []);

  const getNodePosition = (id: string, { nodes }: NodePositionArgs): InternalGraphPosition => {
    const currentNode = nodes.find(n => n.id === id) as LabGraphNode;
    if (!currentNode) {
      return {
        id,
        x: 0,
        y: 0,
        z: 1,
        index: 0,
        data: undefined,
        links: []
      };
    }

    // Group nodes by labId
    const labGroups: Record<string, LabGraphNode[]> = {};
    (nodes as LabGraphNode[]).forEach(node => {
      if (!labGroups[node.labId]) labGroups[node.labId] = [];
      labGroups[node.labId].push(node);
    });

    const labOrder = Object.keys(labGroups);
    const groupIndex = labOrder.indexOf(currentNode.labId);
    const nodeIndex = labGroups[currentNode.labId].findIndex(n => n.id === id);

    return {
      id,
      x: nodeIndex * 100,
      y: groupIndex * 80,
      z: 1,
      index: nodeIndex,
      data: currentNode,
      links: []
    };
  };

  return (
    <div className="flex justify-center items-center my-8">
      <div className="w-[600px] h-[300px] border rounded shadow bg-white dark:bg-gray-900 relative overflow-hidden">
        <GraphCanvas
          nodes={nodes}
          edges={edges}
          layoutType="custom"
          layoutOverrides={{ getNodePosition }}
        />
      </div>
    </div>
  );
}

function getLevelColor(level: number): string {
  const palette = ["#f87171", "#fb923c", "#facc15", "#4ade80", "#60a5fa"];
  return palette[level] || "#a3a3a3";
}
