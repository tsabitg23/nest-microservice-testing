package product

import (
	"github.com/gin-gonic/gin"
	"github.com/tsabitg23/go-grpc-api-gateway/pkg/auth"
	"github.com/tsabitg23/go-grpc-api-gateway/pkg/config"
	"github.com/tsabitg23/go-grpc-api-gateway/pkg/product/routes"
)

func RegisterRoutes(r *gin.Engine, c *config.Config, authSvc *auth.ServiceClient) {
	a := auth.InitAuthMiddleware(authSvc)

	svc := &ServiceClient{
		Client: InitServiceClient(c),
	}

	routes := r.Group("/product")
	routes.Use(a.AuthRequired)
	routes.POST("/", svc.CreateProduct)
	routes.GET("/", svc.FindAllProducts)
	routes.GET("/:id", svc.FindOne)
	routes.PUT("/:id", svc.UpdateProduct)
	routes.DELETE("/:id", svc.DeleteProduct)
}

func (svc *ServiceClient) FindAllProducts(ctx *gin.Context) {
	routes.FindAllProducts(ctx, svc.Client)
}

func (svc *ServiceClient) FindOne(ctx *gin.Context) {
	routes.FindOneProduct(ctx, svc.Client)
}

func (svc *ServiceClient) CreateProduct(ctx *gin.Context) {
	routes.CreateProduct(ctx, svc.Client)
}

func (svc *ServiceClient) UpdateProduct(ctx *gin.Context) {
	routes.UpdateProduct(ctx, svc.Client)
}

func (svc *ServiceClient) DeleteProduct(ctx *gin.Context) {
	routes.DeleteProduct(ctx, svc.Client)
}
