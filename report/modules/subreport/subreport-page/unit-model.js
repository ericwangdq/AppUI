/**
 * Created by Eric on 12/24/2014.
 */

define(['jquery','underscore', 'backbone'],

    function($, _, Backbone){

        'use strict';

        /**
         * Home Model
         * @constructor
         * @private
         */
        var UnitModel = Backbone.Model.extend({

            defaults : {
                unitCode: '',
                unitName: '',
                months: []
            },

            flag: false

        });

        return UnitModel;

    });