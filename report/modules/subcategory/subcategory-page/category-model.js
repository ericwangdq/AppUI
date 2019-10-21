/**
 * Created by Eric on 12/22/2014.
 */

define(['jquery','underscore', 'backbone'],

    function($, _, Backbone){

        'use strict';

        /**
         * Model
         * @constructor
         * @private
         */
        var CategoryModel = Backbone.Model.extend({

            defaults : {
                categoryCode: '',
                categoryName: '',
                totalNumber: '',
                categories: []
            }

        });

        return CategoryModel;

    });