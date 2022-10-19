-include .env

VERSION ?= $(shell git rev-parse --short HEAD)
CURRENT_BRANCH ?= $(shell git rev-parse --abbrev-ref HEAD)

IMAGE_NAME_HAPI=eden-api-hapi
IMAGE_NAME_HASURA=eden-api-hasura

DOCKER_REGISTRY=eoscostarica506
SUBDIRS = hapi hasura

MAKE_ENV += DOCKER_REGISTRY VERSION IMAGE_NAME_HAPI IMAGE_NAME_HASURA

SHELL_EXPORT := $(foreach v,$(MAKE_ENV),$(v)='$($(v))')

ifneq ("$(wildcard .env)", "")
	export $(shell sed 's/=.*//' .env)
endif