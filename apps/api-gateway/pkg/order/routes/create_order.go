package routes

import (
	"context"
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/tsabitg23/go-grpc-api-gateway/pkg/order/pb"
)

// @Summary create order
// @Schemes
// @Description create new order
// @Tags order
// @Accept json
// @Produce json
// @Param body body pb.CreateOrderDto true "Create Order Request"
// @Success 201 {object} pb.CreateOrderResponse
// @Failure 400 {object} pb.CreateOrderResponse
// @Failure 404 {object} pb.CreateOrderResponse
// @Router /order [post]
func CreateOrder(ctx *gin.Context, c pb.OrderServiceClient) {
	body := pb.CreateOrderDto{}

	if err := ctx.BindJSON(&body); err != nil {
		ctx.AbortWithError(http.StatusBadRequest, err)
		return
	}

	userId, _ := ctx.Get("userId")

	res, err := c.CreateOrder(context.Background(), &pb.CreateOrderDto{
		Products: body.Products,
		UserId:   userId.(string),
	})

	if err != nil {
		ctx.AbortWithError(http.StatusBadGateway, err)
		return
	}

	ctx.JSON(http.StatusCreated, &res)
}
