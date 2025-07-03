"use client";

import { useEffect, useState } from "react";
import { GraphCanvas, GraphNode, GraphEdge  } from "reagraph";

interface BackendNode {
  id: string;
  label: string;
  level: number;
}

interface BackendEdge {
  from: string;
  to: string;
}

export default function LabHistoryGraph() {
  const [nodes, setNodes] = useState<GraphNode[]>([]);
  const [edges, setEdges] = useState<GraphEdge[]>([]);

  useEffect(() => {
    fetch("http://localhost:3000/lab/dependencies/graph")
      .then((res) => res.json())
      .then((data) => {
        const mappedNodes: GraphNode[] = data.nodes.map((n: BackendNode) => ({
          id: n.id,
          label: n.label,
          subLabel: `Level ${n.level}`,
          fill: getLevelColor(n.level),
        }));

        const mappedEdges: GraphEdge[] = data.edges.map((e: BackendEdge) => ({
          source: e.from,
          target: e.to,
          id: `${e.from}-${e.to}`,
          label: `${e.from}-${e.to}`,
        }));

        setNodes(mappedNodes);
        setEdges(mappedEdges);

        console.log("Graph data loaded:", { nodes: mappedNodes, edges: mappedEdges, data });
      })
      .catch(console.error);
  }, []);

  return (
    <div className="flex justify-center items-center my-8">
        <div className="w-[600px] h-[300px] border rounded shadow bg-white dark:bg-gray-900 relative overflow-hidden">
            <GraphCanvas
            nodes={nodes}
            edges={edges}
            />
        </div>
    </div>


  );
}

function getLevelColor(level: number): string {
  const palette = ["#f87171", "#fb923c", "#facc15", "#4ade80", "#60a5fa"];
  return palette[level] || "#a3a3a3";
}
