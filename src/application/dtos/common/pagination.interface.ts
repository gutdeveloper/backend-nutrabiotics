/**
 * Interface for pagination parameters
 */
export interface PaginationParamsDto {
  page: number;
  limit: number;
}

/**
 * Generic interface for paginated responses
 */
export interface PaginatedResponseDto<T> {
  data: T[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
} 