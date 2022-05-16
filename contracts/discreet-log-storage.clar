;;ERROR CODES
(define-constant err-unauthorised (err u2001))
(define-constant err-dlc-already-added (err u2002))
(define-constant err-unknown-dlc (err u2003))
(define-constant err-not-reached-closing-time (err u2004))
(define-constant err-already-closed (err u2005))
(define-constant err-already-passed-closing-time (err u2006))
(define-constant err-not-closed (err u2007))

;;CONTRACT OWNER
(define-constant contract-owner tx-sender)

;;NFT to keep track of the open dlcs easily
(define-non-fungible-token open-dlc (buff 8))

(define-map dlcs
	(buff 8)
	{
    uuid: (buff 8),
    asset: (buff 32),
    closing-time: uint,
    status: (optional uint),
    actual-closing-time: uint,
    emergency-refund-time: uint,
    creator: principal
	})

(define-read-only (get-last-block-timestamp)
  (default-to u0 (get-block-info? time (- block-height u1))))

(define-read-only (get-dlc (uuid (buff 8)))
  (map-get? dlcs uuid))

;;opens a new dlc
(define-public (open-new-dlc (uuid (buff 8)) (asset (buff 32)) (closing-time uint) (emergency-refund-time uint) (creator principal))
  (begin
    (asserts! (is-eq contract-owner tx-sender) err-unauthorised)
    (asserts! (is-none (map-get? dlcs uuid)) err-dlc-already-added)
    (map-set dlcs uuid {
      uuid: uuid, 
      asset: asset, 
      closing-time: closing-time, 
      status: none, 
      actual-closing-time: u0, 
      emergency-refund-time: emergency-refund-time,
      creator: creator })
    (nft-mint? open-dlc uuid .discreet-log-storage))) ;;mint an open-dlc nft to keep track of open dlcs

;;emits an event
(define-public (create-dlc (asset (buff 32)) (closing-time uint) (emergency-refund-time uint))
  (begin 
    (print {
      asset: asset, 
      closing-time: closing-time, 
      emergency-refund-time: emergency-refund-time,
      creator: tx-sender})
    (ok true)))

;;normal dlc close
(define-public (close-dlc (uuid (buff 8)))
  (let (
    (dlc (unwrap! (get-dlc uuid) err-unknown-dlc))
    (block-timestamp (get-last-block-timestamp))
    )
    (asserts! (>= block-timestamp (get closing-time dlc)) err-not-reached-closing-time)
    (asserts! (is-none (get status dlc)) err-already-closed)
    (asserts! (or (is-eq contract-owner tx-sender) (is-eq (get creator dlc) tx-sender)) err-unauthorised)
    (map-set dlcs uuid (merge dlc { status: (some u1), actual-closing-time: block-timestamp }))
    (nft-burn? open-dlc uuid .discreet-log-storage))) ;;burn the open-dlc nft related to the UUID

;;early dlc close
(define-public (early-close-dlc (uuid (buff 8)))
  (let (
    (dlc (unwrap! (get-dlc uuid) err-unknown-dlc))
    (block-timestamp (get-last-block-timestamp))
    )
    (asserts! (< block-timestamp (get closing-time dlc)) err-already-passed-closing-time)
    (asserts! (is-none (get status dlc)) err-already-closed)
    (asserts! (or (is-eq contract-owner tx-sender) (is-eq (get creator dlc) tx-sender)) err-unauthorised)
    (map-set dlcs uuid (merge dlc { status: (some u0), actual-closing-time: block-timestamp }))
    (nft-burn? open-dlc uuid .discreet-log-storage))) ;;burn the open-dlc nft related to the UUID

;; get the status of the DLC by UUID
(define-read-only (dlc-status (uuid (buff 8)))
(let (
    (dlc (unwrap! (get-dlc uuid) err-unknown-dlc))
    )
    (asserts! (is-some (get status dlc)) err-not-closed)
    (ok (unwrap-panic (get status dlc)))))