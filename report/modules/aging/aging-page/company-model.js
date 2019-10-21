/**
 * Created by Eric on 12/24/2014.
 */

define(['jquery','underscore', 'backbone',
       'aging/aging-page/range-collection'],

    function($, _, Backbone, RangeCollection){

        'use strict';

        /**
         * Home Model
         * @constructor
         * @private
         */
        var CompanyModel = Backbone.Model.extend({

            defaults : {
                companyCode: '',
                companyName: '',
                ranges: new RangeCollection()
            },

            flag: false

        });

        return CompanyModel;

    });