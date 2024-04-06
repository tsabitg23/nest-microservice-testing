package routes

import (
	"context"
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/tsabitg23/go-grpc-api-gateway/pkg/product/pb"
)

// @Summary update product
// @Schemes
// @Description update product by id
// @Tags product
// @Accept json
// @Produce json
// @Param id path string true "Product ID"
// @Param body body pb.UpdateProductDto true "Update Product Request"
// @Success 200 {object} pb.UpdateProductResponse
// @Failure 400 {object} pb.UpdateProductResponse
// @Router /product/{id} [put]
func UpdateProduct(ctx *gin.Context, c pb.ProductServiceClient) {
	body := pb.UpdateProductDto{}

	if err := ctx.BindJSON(&body); err != nil {
		ctx.AbortWithError(http.StatusBadRequest, err)
		return
	}

	res, err := c.UpdateProduct(context.Background(), &pb.UpdateProductDto{
		Id:          ctx.Param("id"),
		Name:        body.Name,
		Description: body.Description,
		Stock:       body.Stock,
		Price:       body.Price,
	})

	if err != nil {
		ctx.AbortWithError(http.StatusBadGateway, err)
		return
	}

	ctx.JSON(http.StatusOK, &res)
}
