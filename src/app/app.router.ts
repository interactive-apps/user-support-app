
import { UIRouter }  from "@uirouter/angular";


/** UIRouter Config  */
export function UIRouterConfigFn(router: UIRouter) {
    router.urlService.rules.otherwise({ state: 'home.action' });
}
