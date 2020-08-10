let collapseRightControlTemplate = `
<div style="float: left; width: 0px; height: 100%; overflow: visible">
    <div style="width: 25px; height: 100%; position: relative; z-index: 10; display: flex; align-items: center;" v-bind:style="'right: 17px;'" v-on:mouseover="showButton" v-on:mouseleave="hideButton">
        <div v-if="isButtonVisible" class="ui small inverted active icon button" style="padding: 20px 1px; borderTopLeftRadius: 10px; borderBottomLeftRadius: 10px; borderTopRightRadius: 0px; borderBottomRightRadius: 0px;" v-on:click="$emit('input', !value)">
            <i class="chevron icon" v-bind:class="{ right: !value, left: value }"></i>
        </div>
    </div>
</div>
`;

Vue.component('collapse-right-control', {
    template: collapseRightControlTemplate,
    props: {
        value: Boolean,
        gutterSize: {
            type: Number,
            default: 3
        },
        autoHide: {
            default: false
        }
    },
    data: function() {
        return {
            isButtonVisible: this.autoHide ? false : true
        }
    },
    methods: {
        showButton: function() {
            this.isButtonVisible = true;
        },
        hideButton: function() {
            this.isButtonVisible = this.autoHide ? false : true;
        }
    }
})