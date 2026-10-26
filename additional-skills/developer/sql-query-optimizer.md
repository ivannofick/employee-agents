# Skill: SQL Query Optimizer

## Metadata
- **Owner**: Tn. Crab (Developer)
- **Slug**: sql-query-optimizer
- **Purpose**: Eliminate N+1 queries, audit index utilization, and analyze query execution plans.

## Operational Rules & Guidelines
1. **Never Guess Indexing**: Always run `EXPLAIN ANALYZE` or database execution plans before and after adding indexes.
2. **Eliminate N+1**: Ensure ORM queries use eager loading (`with`, `include`, `select_related`) when accessing relationships.
3. **Compound Index Column Order**: Put high-cardinality equality columns first, range filters last.
4. **Avoid `SELECT *`**: Explicitly specify required columns in high-volume queries to save bandwidth and memory.

## Procedures
- Step 1: Extract slow queries from logs or ORM profiling.
- Step 2: Run execution plan analysis to detect table scans and missing indexes.
- Step 3: Implement defensive indexes or refactor ORM joins.
- Step 4: Verify execution speed improvement and report findings to Garry & Bos.
