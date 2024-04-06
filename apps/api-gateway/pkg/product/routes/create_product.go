package routes

import (
	"context"
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/tsabitg23/go-grpc-api-gateway/pkg/product/pb"
)

// @Summary create product
// @Schemes
// @Description create new product
// @Tags product
// @Accept json
// @Produce json
// @Param body body pb.CreateProductDto true "Create Product Request"
// @Success 201 {object} pb.CreateProductResponse
// @Failure 400 {object} pb.CreateProductResponse
// @Router /product [post]
func CreateProduct(ctx *gin.Context, c pb.ProductServiceClient) {
	body := pb.CreateProductDto{}

	if err := ctx.BindJSON(&body); err != nil {
		ctx.AbortWithError(http.StatusBadRequest, err)
		return
	}

	res, err := c.CreateProduct(context.Background(), &pb.CreateProductDto{
		Name:        body.Name,
		Description: body.Description,
		Stock:       body.Stock,
		Price:       body.Price,
	})

	if err != nil {
		ctx.AbortWithError(http.StatusBadGateway, err)
		return
	}

	ctx.JSON(http.StatusCreated, &res)
}
