# Skill: Load & Stress Testing

## Metadata
- **Owner**: Stanley (QA Engineer)
- **Slug**: load-stress-testing
- **Purpose**: Concurrency stress testing, memory leak detection under pressure, and threshold breaking tests.

## Operational Rules & Guidelines
1. **Ramp-Up Curve**: Gradually ramp up concurrent virtual users (e.g. 10 -> 50 -> 200 -> 1000) to find the exact saturation inflection point.
2. **Observe Error Rate**: Watch for HTTP 429, 502, 503, and 504 surges.
3. **Memory Profile Monitoring**: Observe heap allocations across sustained test runs to identify runaway memory leaks.
4. **Isolate Test DB**: Never run destructive stress tests against production or shared team databases.

## Procedures
- Step 1: Write load test script (using k6, autocannon, or Artillery).
- Step 2: Execute load runs and log request latency percentiles (p50, p95, p99).
- Step 3: Identify bottlenecks (database connection pool starvation, CPU throttling).
- Step 4: Report breaking thresholds to Garry and Bos.
