package routes

import (
	"context"
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/tsabitg23/go-grpc-api-gateway/pkg/product/pb"
)

// @Summary find all products
// @Schemes
// @Description find all products
// @Tags product
// @Accept json
// @Produce json
// @Success 200 {object} pb.FindAllProductsResponse
// @Failure 400 {object} pb.FindAllProductsResponse
// @Router /product [get]
func FindAllProducts(ctx *gin.Context, c pb.ProductServiceClient) {

	res, err := c.FindAllProducts(context.Background(), &pb.Empty{})

	if err != nil {
		ctx.AbortWithError(http.StatusBadGateway, err)
		return
	}

	ctx.JSON(http.StatusOK, &res)
}
