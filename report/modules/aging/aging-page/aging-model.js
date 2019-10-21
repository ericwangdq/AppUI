/**
 * Created by Eric on 12/24/2014.
 */

define(['jquery','underscore', 'backbone',
        'aging/aging-page/company-collection'],

    function($, _, Backbone, CompanyCollection){

        'use strict';

        /**
         * Home Model
         * @constructor
         * @private
         */
        var AgingModel = Backbone.Model.extend({

            defaults : {
                categoryCode:'',
                categoryName: '',
                companies: new CompanyCollection()
            },

            flag: false

        });

        return AgingModel;

    });