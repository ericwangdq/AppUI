/**
 * Created by Eric on 1/20/2015.
 */
define(['jquery','underscore', 'backbone',
        'base/eiinfo', 'services/agent'],

    function($, _, Backbone, Eiinfo, Agent){

        'use strict';

        /**
         * Home Model
         * @constructor
         * @private
         */
        var GroupModel = Backbone.Model.extend({

            defaults : {
                cogrGuid: '',      //group id
                cogrName: '',   //group name
                cogrSubset: ''      //has sub group
            },

            initialize: function(){

                var me = this;

            },

            flag: false


        });

        return GroupModel;

    });