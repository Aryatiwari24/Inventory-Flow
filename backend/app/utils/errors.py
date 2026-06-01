from fastapi import HTTPException, status

class InventoryFlowException(Exception):
    """Base exception for InventoryFlow system errors"""
    def __init__(self, message: str, error_code: str, status_code: int = 400):
        self.message = message
        self.error_code = error_code
        self.status_code = status_code
        super().__init__(message)


class DuplicateSKUException(InventoryFlowException):
    def __init__(self, message: str = "SKU already exists"):
        super().__init__(
            message=message,
            error_code="DUPLICATE_SKU",
            status_code=status.HTTP_400_BAD_REQUEST
        )


class DuplicateEmailException(InventoryFlowException):
    def __init__(self, message: str = "Customer email already exists"):
        super().__init__(
            message=message,
            error_code="DUPLICATE_EMAIL",
            status_code=status.HTTP_400_BAD_REQUEST
        )


class InsufficientStockException(InventoryFlowException):
    def __init__(self, message: str = "Inventory insufficient"):
        super().__init__(
            message=message,
            error_code="INSUFFICIENT_STOCK",
            status_code=status.HTTP_400_BAD_REQUEST
        )


class NegativeStockException(InventoryFlowException):
    def __init__(self, message: str = "Stock cannot be negative"):
        super().__init__(
            message=message,
            error_code="INVALID_STOCK",
            status_code=status.HTTP_400_BAD_REQUEST
        )


class ResourceNotFoundException(InventoryFlowException):
    def __init__(self, message: str = "Resource not found"):
        super().__init__(
            message=message,
            error_code="RESOURCE_NOT_FOUND",
            status_code=status.HTTP_404_NOT_FOUND
        )


class DeleteRestrictedException(InventoryFlowException):
    def __init__(self, message: str = "Cannot delete resource because it is referenced by active orders"):
        super().__init__(
            message=message,
            error_code="DELETE_RESTRICTED",
            status_code=status.HTTP_400_BAD_REQUEST
        )
