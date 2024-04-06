package routes

import (
	"context"
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/tsabitg23/go-grpc-api-gateway/pkg/product/pb"
)

// @Summary find one product
// @Schemes
// @Description find one product by id
// @Tags product
// @Accept json
// @Produce json
// @Param id path string true "Product ID"
// @Success 200 {object} pb.FindOneProductResponse
// @Failure 404 {object} pb.FindOneProductResponse
// @Router /product/{id} [get]
func FindOneProduct(ctx *gin.Context, c pb.ProductServiceClient) {

	res, err := c.FindOneProduct(context.Background(), &pb.FindOneProductDto{
		Id: ctx.Param("id"),
	})

	if err != nil {
		ctx.AbortWithError(http.StatusBadGateway, err)
		return
	}

	ctx.JSON(http.StatusOK, &res)
}
