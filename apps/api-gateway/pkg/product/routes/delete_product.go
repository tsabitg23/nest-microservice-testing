package routes

import (
	"context"
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/tsabitg23/go-grpc-api-gateway/pkg/product/pb"
)

// @Summary delete product
// @Schemes
// @Description delete product by id
// @Tags product
// @Accept json
// @Produce json
// @Param id path string true "Product ID"
// @Success 200 {object} pb.DeleteProductResponse
// @Failure 400 {object} pb.DeleteProductResponse
// @Router /product/{id} [delete]
func DeleteProduct(ctx *gin.Context, c pb.ProductServiceClient) {

	res, err := c.DeleteProduct(context.Background(), &pb.FindOneProductDto{
		Id: ctx.Param("id"),
	})

	if err != nil {
		ctx.AbortWithError(http.StatusBadGateway, err)
		return
	}

	ctx.JSON(http.StatusOK, &res)
}
