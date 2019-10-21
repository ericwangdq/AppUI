/**
 * Created by Eric on 9/23/2014.
 */

define(['jquery','underscore', 'backbone',
        'home/home-page/category-collection'],

    function($, _, Backbone, CategoryCollection){

        'use strict';

        /**
         * Home Model
         * @constructor
         * @private
         */
        var HomeModel = Backbone.Model.extend({

            defaults : {
                companyCode: '',
                companyName: '',
                categories: new CategoryCollection()
            },

            flag: false

        });

        return HomeModel;

    });