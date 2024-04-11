package main

import (
	"log"

	"github.com/gin-gonic/gin"
	swaggerfiles "github.com/swaggo/files"
	ginSwagger "github.com/swaggo/gin-swagger"
	docs "github.com/tsabitg23/go-grpc-api-gateway/docs"
	"github.com/tsabitg23/go-grpc-api-gateway/pkg/auth"
	"github.com/tsabitg23/go-grpc-api-gateway/pkg/config"
	"github.com/tsabitg23/go-grpc-api-gateway/pkg/limit"
	"github.com/tsabitg23/go-grpc-api-gateway/pkg/order"
	"github.com/tsabitg23/go-grpc-api-gateway/pkg/product"
)

// @BasePath /api
func main() {
	c, err := config.LoadConfig()

	if err != nil {
		log.Fatalln("Failed at config", err)
	}

	r := gin.Default()
	r.Use(limit.GetMiddleWare())
	docs.SwaggerInfo.BasePath = "/api/"
	r.GET("/swagger/*any", ginSwagger.WrapHandler(swaggerfiles.Handler))
	authSvc := *auth.RegisterRoutes(r, &c)
	product.RegisterRoutes(r, &c, &authSvc)
	order.RegisterRoutes(r, &c, &authSvc)

	r.Run(c.Port)
}
