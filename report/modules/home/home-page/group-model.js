/**
 * Created by Eric on 9/23/2014.
 */

define(['jquery','underscore', 'backbone'],

    function($, _, Backbone){

        'use strict';

        /**
         * Home Model
         * @constructor
         * @private
         */
        var GroupModel = Backbone.Model.extend({

            defaults : {
                groups: '',
                categoryTotal: ''
            },

            flag: false

        });

        return GroupModel;

    });