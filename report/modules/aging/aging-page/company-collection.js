/**
 * Created by Eric on 1/14/2015.
 */


define(['jquery','underscore', 'backbone','utilities/session',
        'base/eiinfo','services/agent', 'config/serverConfig',
        'aging/aging-page/company-model'],

    function($, _, Backbone, Session, Eiinfo, Agent,
             ServerConfig, CompanyModel){

        'use strict';

        /**
         * Home Model
         * @constructor
         * @private
         */
        var CompanyCollection = Backbone.Collection.extend({

            model: CompanyModel,

            initialize: function(){

                var me = this;

            }

        });

        return CompanyCollection;

    });