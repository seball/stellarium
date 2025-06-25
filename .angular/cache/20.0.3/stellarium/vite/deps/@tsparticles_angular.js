import {
  tsParticles
} from "./chunk-B6VNUXO5.js";
import {
  isPlatformServer
} from "./chunk-24J6JJSY.js";
import {
  BehaviorSubject,
  Component,
  EventEmitter,
  Inject,
  Injectable,
  Input,
  NgModule,
  Output,
  PLATFORM_ID,
  Subject,
  from,
  mergeMap,
  setClassMetadata,
  takeUntil,
  ɵɵdefineComponent,
  ɵɵdefineInjectable,
  ɵɵdefineInjector,
  ɵɵdefineNgModule,
  ɵɵdirectiveInject,
  ɵɵelement,
  ɵɵproperty
} from "./chunk-I6JAM3B5.js";
import {
  __async
} from "./chunk-GUMZHFXY.js";

// node_modules/@tsparticles/angular/fesm2022/tsparticles-angular.mjs
var NgParticlesService = class _NgParticlesService {
  initialized = new BehaviorSubject(false);
  getInstallationStatus() {
    return this.initialized.asObservable();
  }
  init(particlesInit) {
    return __async(this, null, function* () {
      yield particlesInit(tsParticles);
      this.initialized.next(true);
    });
  }
  static ɵfac = function NgParticlesService_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _NgParticlesService)();
  };
  static ɵprov = ɵɵdefineInjectable({
    token: _NgParticlesService,
    factory: _NgParticlesService.ɵfac,
    providedIn: "root"
  });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(NgParticlesService, [{
    type: Injectable,
    args: [{
      providedIn: "root"
    }]
  }], null, null);
})();
var NgxParticlesComponent = class _NgxParticlesComponent {
  platformId;
  particlesService;
  options;
  url;
  id;
  particlesInit;
  particlesLoaded = new EventEmitter();
  subscription;
  destroy$ = new Subject();
  container;
  constructor(platformId, particlesService) {
    this.platformId = platformId;
    this.particlesService = particlesService;
    this.id = "tsparticles";
  }
  ngOnInit() {
    this.subscription = this.particlesService.getInstallationStatus().subscribe(() => {
      this.container?.destroy();
      this.loadParticles();
    });
  }
  ngAfterViewInit() {
    if (isPlatformServer(this.platformId)) {
      return;
    }
    this.loadParticles();
  }
  ngOnDestroy() {
    this.container?.destroy();
    this.subscription?.unsubscribe();
    this.destroy$.next();
  }
  loadParticles() {
    const cb = (container) => {
      this.container = container;
      this.particlesLoaded.emit(container);
    };
    from(this.particlesInit ? this.particlesInit(tsParticles) : Promise.resolve()).pipe(mergeMap(() => {
      return tsParticles.load({
        id: this.id,
        url: this.url,
        options: this.options
      });
    }), takeUntil(this.destroy$)).subscribe(cb);
  }
  static ɵfac = function NgxParticlesComponent_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _NgxParticlesComponent)(ɵɵdirectiveInject(PLATFORM_ID), ɵɵdirectiveInject(NgParticlesService));
  };
  static ɵcmp = ɵɵdefineComponent({
    type: _NgxParticlesComponent,
    selectors: [["ngx-particles"]],
    inputs: {
      options: "options",
      url: "url",
      id: "id",
      particlesInit: "particlesInit"
    },
    outputs: {
      particlesLoaded: "particlesLoaded"
    },
    standalone: false,
    decls: 1,
    vars: 1,
    consts: [[3, "id"]],
    template: function NgxParticlesComponent_Template(rf, ctx) {
      if (rf & 1) {
        ɵɵelement(0, "div", 0);
      }
      if (rf & 2) {
        ɵɵproperty("id", ctx.id);
      }
    },
    encapsulation: 2
  });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(NgxParticlesComponent, [{
    type: Component,
    args: [{
      selector: "ngx-particles",
      template: '<div [id]="id"></div>'
    }]
  }], () => [{
    type: void 0,
    decorators: [{
      type: Inject,
      args: [PLATFORM_ID]
    }]
  }, {
    type: NgParticlesService
  }], {
    options: [{
      type: Input
    }],
    url: [{
      type: Input
    }],
    id: [{
      type: Input
    }],
    particlesInit: [{
      type: Input
    }],
    particlesLoaded: [{
      type: Output
    }]
  });
})();
var NgxParticlesModule = class _NgxParticlesModule {
  static ɵfac = function NgxParticlesModule_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _NgxParticlesModule)();
  };
  static ɵmod = ɵɵdefineNgModule({
    type: _NgxParticlesModule,
    declarations: [NgxParticlesComponent],
    exports: [NgxParticlesComponent]
  });
  static ɵinj = ɵɵdefineInjector({
    providers: [NgParticlesService]
  });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(NgxParticlesModule, [{
    type: NgModule,
    args: [{
      declarations: [NgxParticlesComponent],
      exports: [NgxParticlesComponent],
      providers: [NgParticlesService]
    }]
  }], null, null);
})();
export {
  NgParticlesService,
  NgxParticlesComponent,
  NgxParticlesModule
};
//# sourceMappingURL=@tsparticles_angular.js.map
