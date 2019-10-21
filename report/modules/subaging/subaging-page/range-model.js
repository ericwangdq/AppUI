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
        var RangeModel = Backbone.Model.extend({

            defaults : {
                rangeCode: '',
                rangeName: '',
                months: []
            },

            flag: false

        });

        return RangeModel;

    });