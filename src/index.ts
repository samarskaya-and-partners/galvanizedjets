import { setupMovingParts } from './movingparts'
import { setupFunctions,lazyLoadWordlist } from './functions'

import * as $ from "jquery";

$( () => {
  setupMovingParts();
  setupFunctions();
  lazyLoadWordlist("latin", () => {
    /* Start defaults */
    $("#btn_latin").click()
    $("#uppercase_pie").click()
    $("#hobonop input").click()
  })
})
