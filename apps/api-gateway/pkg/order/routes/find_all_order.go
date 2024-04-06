package routes

import (
	"context"
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/tsabitg23/go-grpc-api-gateway/pkg/order/pb"
)

// @Summary find all orders
// @Schemes
// @Description find all orders
// @Tags order
// @Accept json
// @Produce json
// @Success 200 {object} pb.GetAllOrderResponse
// @Failure 400 {object} pb.GetAllOrderResponse
// @Router /order [get]
func FindAllOrders(ctx *gin.Context, c pb.OrderServiceClient) {

	res, err := c.GetAllOrders(context.Background(), &pb.GetAllOrderDto{})

	if err != nil {
		ctx.AbortWithError(http.StatusBadGateway, err)
		return
	}

	ctx.JSON(http.StatusOK, &res)
}
