/**
 * Created by Eric on 1/14/2015.
 */

define(['jquery','underscore', 'backbone','utilities/session',
        'base/eiinfo','services/agent', 'config/serverConfig',
        'home/home-page/category-model'],

    function($, _, Backbone, Session, Eiinfo, Agent,
             ServerConfig, CategoryModel){

        'use strict';

        /**
         * Home Model
         * @constructor
         * @private
         */
        var CategoryCollection = Backbone.Collection.extend({

            model: CategoryModel,

            initialize: function(){

                var me = this;

            }

        });

        return CategoryCollection;

    });