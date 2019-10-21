/**
 * Created by Eric on 1/14/2015.
 */

define(['jquery','underscore', 'backbone','utilities/session',
        'services/agent', 'config/serverConfig',
        'subaging/subaging-page/range-model'],

    function($, _, Backbone, Session, Agent,
             ServerConfig, RangeModel){

        'use strict';

        /**
         * Home Model
         * @constructor
         * @private
         */
        var RangeCollection = Backbone.Collection.extend({

            model: RangeModel,

            initialize: function(){

                var me = this;

            }

        });

        return RangeCollection;

    });