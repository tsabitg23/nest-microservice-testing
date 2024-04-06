package routes

import (
	"context"
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/tsabitg23/go-grpc-api-gateway/pkg/order/pb"
)

func FindAllOrders(ctx *gin.Context, c pb.OrderServiceClient) {

	res, err := c.GetAllOrders(context.Background(), &pb.GetAllOrderDto{})

	if err != nil {
		ctx.AbortWithError(http.StatusBadGateway, err)
		return
	}

	ctx.JSON(http.StatusOK, &res)
}
