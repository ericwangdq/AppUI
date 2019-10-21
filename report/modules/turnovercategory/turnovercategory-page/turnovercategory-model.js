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
        var TurnoverCategoryModel = Backbone.Model.extend({

            defaults : {
                categoryName: '',
                categoryCode: '',
                totalNumber: ''
            },

            flag: false

        });

        return TurnoverCategoryModel;

    });