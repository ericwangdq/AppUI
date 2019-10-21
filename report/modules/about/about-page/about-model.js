/**
 * Created by Eric on 12/24/2014.
 */

define(['jquery','underscore', 'backbone'],

    function($, _, Backbone){

        'use strict';

        /**
         * About Model
         * @constructor
         * @private
         */
        var AboutModel = Backbone.Model.extend({

            defaults : {
            },

            flag: false

        });

        return AboutModel;

    });