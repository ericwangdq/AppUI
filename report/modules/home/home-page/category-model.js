/**
 * Created by Eric on 1/14/2015.
 */

define(['jquery','underscore', 'backbone'],

    function($, _, Backbone){

        'use strict';

        /**
         * Home Model
         * @constructor
         * @private
         */
        var CategoryModel = Backbone.Model.extend({

            defaults : {
                categoryCode: '',
                categoryName: '',
                totalNumber: 0
            },

            flag: false

        });

        return CategoryModel;

    });