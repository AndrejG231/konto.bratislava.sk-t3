'use strict'

/**
 * vzn service.
 */

const { createCoreService } = require('@strapi/strapi').factories

module.exports = createCoreService('api::vzn.vzn')