/**
 * Created by Eric on 1/14/2015.
 */

define(['jquery','underscore', 'backbone',
        'utilities/session',
        'services/agent',
        'config/serverConfig',
        'subreport/subreport-page/unit-model'],

    function($, _, Backbone, Session,
             Agent,
             ServerConfig,
             UnitModel){

        'use strict';

        /**
         * Model
         * @constructor
         * @private
         */
        var UnitCollection = Backbone.Collection.extend({

            model: UnitModel,

            initialize: function(){

                var me = this;

            }

        });

        return UnitCollection;

    });