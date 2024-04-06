package order

import (
	"github.com/gin-gonic/gin"
	"github.com/tsabitg23/go-grpc-api-gateway/pkg/auth"
	"github.com/tsabitg23/go-grpc-api-gateway/pkg/config"
	"github.com/tsabitg23/go-grpc-api-gateway/pkg/order/routes"
)

func RegisterRoutes(r *gin.Engine, c *config.Config, authSvc *auth.ServiceClient) {
	a := auth.InitAuthMiddleware(authSvc)

	svc := &ServiceClient{
		Client: InitServiceClient(c),
	}

	routes := r.Group("/order")
	routes.Use(a.AuthRequired)
	routes.POST("/", svc.CreateOrder)
	routes.GET("/", svc.FindAllOrders)
}

func (svc *ServiceClient) CreateOrder(ctx *gin.Context) {
	routes.CreateOrder(ctx, svc.Client)
}

func (svc *ServiceClient) FindAllOrders(ctx *gin.Context) {
	routes.FindAllOrders(ctx, svc.Client)
}
