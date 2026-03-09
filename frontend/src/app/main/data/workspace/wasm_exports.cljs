;; This Source Code Form is subject to the terms of the Mozilla Public
;; License, v. 2.0. If a copy of the MPL was not distributed with this
;; file, You can obtain one at http://mozilla.org/MPL/2.0/.
;;
;; Copyright (c) KALEIDOS INC

(ns app.main.data.workspace.wasm-exports
  (:require
   [app.common.media :refer [format->mtype]]
   [app.render-wasm.api :as wasm.api]
   [app.util.dom :as dom]
   [app.util.webapi :as wapi]))

(defn export-image
  [{:keys [type suffix name scale object-id]}]
  (let [bytes (wasm.api/render-shape-pixels object-id scale)
        mtype (format->mtype type)
        blob (wapi/create-blob bytes mtype)
        url (wapi/create-uri blob)
        filename (str name (or suffix ""))]
    (dom/trigger-download-uri filename mtype url)
    (wapi/revoke-uri url)
    nil))
