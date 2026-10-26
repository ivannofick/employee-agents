# Skill: Micro Benchmark & Profiling

## Metadata
- **Owner**: Tn. Crab (Developer)
- **Slug**: micro-benchmark
- **Purpose**: Measure line-level execution time and memory allocations on high-frequency hot paths.

## Operational Rules & Guidelines
1. **Target Hot Paths Only**: Benchmark only critical loops, parsing pipelines, database serialization, and high-frequency endpoints.
2. **Warmup Cycles**: Always execute warmup iterations before recording latency measurements to prevent JIT cold-start skew.
3. **Statistical Significance**: Report p50, p95, and p99 latencies across at least 1,000 sample iterations.
4. **Zero Production Overhead**: Benchmarking harnesses must reside in test/bench directories and never leak into production runtime bundles.

## Procedures
- Step 1: Identify slow or critical functions from task tickets or bug reports.
- Step 2: Write an isolated micro-benchmark test script.
- Step 3: Run comparisons between baseline and optimized implementations.
- Step 4: Output concise performance delta table to Bos (% throughput gain, memory reduction).
