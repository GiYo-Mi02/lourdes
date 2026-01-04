import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';

interface Props {
  isActive: boolean;
  type: 'wave' | 'pulse' | 'bar';
}

export const VitalVisualizer: React.FC<Props> = ({ isActive, type }) => {
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (!svgRef.current || !isActive) return;

    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove(); // Clear previous

    const width = 600;
    const height = 100;
    
    // Set viewbox for responsiveness
    svg.attr("viewBox", `0 0 ${width} ${height}`)
       .attr("preserveAspectRatio", "none");

    if (type === 'wave' || type === 'pulse') {
      const n = 40;
      const data = new Array(n).fill(0);
      
      const line = d3.line<number>()
        .curve(d3.curveBasis)
        .x((d, i) => x(i))
        .y(d => y(d));

      const x = d3.scaleLinear().domain([0, n - 1]).range([0, width]);
      const y = d3.scaleLinear().domain([-1, 1]).range([height, 0]);

      const path = svg.append("g")
        .append("path")
        .datum(data)
        .attr("class", "line")
        .attr("d", line)
        .style("fill", "none")
        .style("stroke", "#2C5F8D")
        .style("stroke-width", 3);

      let offset = 0;
      const timer = d3.timer(() => {
        offset += 0.1;
        // Simulate heartbeat or respiratory wave
        for (let i = 0; i < n; i++) {
           if (type === 'pulse') {
              // Create a heartbeat spike pattern
              const pos = (i + offset) % 20;
              if (pos > 8 && pos < 12) {
                  data[i] = Math.sin((pos - 10) * Math.PI) * 0.8;
              } else {
                  data[i] = (Math.random() - 0.5) * 0.1;
              }
           } else {
              // Sine wave for breathing
              data[i] = Math.sin((i + offset) * 0.5) * 0.8;
           }
        }
        path.attr("d", line);
      });

      return () => {
        timer.stop();
      };
    }

  }, [isActive, type]);

  return (
    <div className="w-full h-24 bg-blue-50/50 rounded-lg overflow-hidden border border-blue-100 mb-6 relative">
      <svg ref={svgRef} className="w-full h-full"></svg>
      {/* Grid overlay */}
      <div className="absolute inset-0 pointer-events-none" 
           style={{ backgroundImage: 'linear-gradient(#2C5F8D10 1px, transparent 1px), linear-gradient(90deg, #2C5F8D10 1px, transparent 1px)', backgroundSize: '20px 20px' }}>
      </div>
    </div>
  );
};
