/**
 * Created by Eric on 1/13/2015.
 */

define(['jquery','underscore', 'backbone'],

    function($, _, Backbone){

        'use strict';

        /**
         * Home Model
         * @constructor
         * @private
         */
        var SubAgingModel = Backbone.Model.extend({

            defaults : {
                categoryCode: '',
                categoryName: '',
                ranges: ''
            },

            flag: false

        });

        return SubAgingModel;

    });