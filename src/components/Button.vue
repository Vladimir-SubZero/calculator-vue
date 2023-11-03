<template>
  <button
    :class="classes"
    @keydown.enter.prevent
    @keydown.space.prevent
    class="sm:h-24 p-4 rounded-lg focus:outline-none active:bg-gray-400"
  >
    <slot></slot>
  </button>
</template>

<script lang="ts">
import { defineComponent, PropType } from "vue";

type IVariant = "yellow" | "blue" | "green" | "red";

type IVariantsClasses = {
  [key in IVariant]: string;
};

export default defineComponent({
  name: "Button",
  props: {
    variant: { type: String as PropType<IVariant>, default: "blue" },
  },

  setup(props) {
    const variantsClasses: IVariantsClasses = {
      yellow: "bg-yellow-500 hover:bg-yellow-400",
      blue: "bg-blue-300 hover:bg-blue-400",
      green: "bg-green-400 hover:bg-green-400",
      red: "bg-red-400 hover:bg-red-500",
    };

    return { classes: variantsClasses[props.variant] };
  },
});
</script>
