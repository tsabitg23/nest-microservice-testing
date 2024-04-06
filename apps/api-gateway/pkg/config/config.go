package config

import "github.com/spf13/viper"

type Config struct {
	Port          string `mapstructure:"PORT"`
	AuthSvcUrl    string `mapstructure:"AUTH_SVC_URL"`
	ProductSvcUrl string `mapstructure:"PRODUCT_SVC_URL"`
	OrderSvcUrl   string `mapstructure:"ORDER_SVC_URL"`
}

func LoadConfig() (c Config, err error) {
	viper.SetConfigFile(".env")

	viper.AutomaticEnv()

	setDefault()

	err = viper.ReadInConfig()

	if err != nil {
		return
	}

	err = viper.Unmarshal(&c)

	return
}

func setDefault() {
	viper.SetDefault("PORT", "")
	viper.SetDefault("AUTH_SVC_URL", "")
	viper.SetDefault("PRODUCT_SVC_URL", "")
	viper.SetDefault("ORDER_SVC_URL", "")
}
