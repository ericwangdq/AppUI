/**
 * Created by Eric on 12/24/2014.
 */

define(['jquery','underscore', 'backbone'],

    function($, _, Backbone){

        'use strict';

        /**
         * Model
         * @constructor
         * @private
         */
        var TurnoverModel = Backbone.Model.extend({

            defaults : {


            },

            flag: false

        });

        return TurnoverModel;

    });