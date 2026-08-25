/**
 * Turns raw `page` / `limit` query params into safe numbers plus the
 * mongoose skip/limit values, and builds the `meta` block returned
 * alongside paginated list responses.
 */
export const getPagination = (page?: string, limit?: string) => {
  const currentPage = Math.max(Number(page) || 1, 1);
  const pageSize = Math.min(Math.max(Number(limit) || 12, 1), 100);
  const skip = (currentPage - 1) * pageSize;
  return { currentPage, pageSize, skip };
};

export const buildMeta = (totalCount: number, currentPage: number, pageSize: number) => {
  const totalPages = Math.max(Math.ceil(totalCount / pageSize), 1);
  return {
    total_count: totalCount,
    total_pages: totalPages,
    current_page: currentPage,
    next_page: currentPage < totalPages ? currentPage + 1 : null,
    prev_page: currentPage > 1 ? currentPage - 1 : null,
  };
};
