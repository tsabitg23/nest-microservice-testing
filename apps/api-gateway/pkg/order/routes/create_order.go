package routes

import (
	"context"
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/tsabitg23/go-grpc-api-gateway/pkg/order/pb"
)

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
