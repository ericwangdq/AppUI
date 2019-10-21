/**
 * Created by Eric on 12/8/2014.
 */

define(['jquery','underscore', 'backbone'],

    function($, _, Backbone){

        'use strict';

        /**
         * Home Model
         * @constructor
         * @private
         */
        var SubReportModel = Backbone.Model.extend({

            defaults : {
                categoryCode: '',
                categoryName: '',
                units: []
            },

            flag: false

        });

        return SubReportModel;

    });