{
  description = "ttt website";

  inputs = {
    nixpkgs.url = "github:nixos/nixpkgs/nixos-unstable";
    prisma-utils.url = "github:VanCoding/nix-prisma-utils";
    flake-utils.url = "github:numtide/flake-utils";
  };

  outputs =
    {
      nixpkgs,
      prisma-utils,
      flake-utils,
      ...
    }:
    flake-utils.lib.eachDefaultSystem (
      system:
      let
        pkgs = import nixpkgs { inherit system; };
        prisma =
          (prisma-utils.lib.prisma-factory {
            inherit pkgs;
            prisma-fmt-hash = "sha256-iZuomC/KaLF0fQy6RVHwk2qq4DRaG3xj+sWmtLofiMU=";
            query-engine-hash = "sha256-Pl/YpYu326qqpbVfczM5RxB8iWXZlewG9vToqzSPIQo=";
            libquery-engine-hash = "sha256-ETwMIJMjMgZmjH6QGD7GVwYYlyx9mo2ydEeunFViCjQ=";
            schema-engine-hash = "sha256-rzzzPHOpUM3GJvkhU08lQ7rNspdq3RKxMRRW9YZtvhU=";
          }).fromPnpmLock
            ./pnpm-lock.yaml;
      in
      {
        devShells.default = pkgs.mkShell {
          packages = with pkgs; [
            nodejs_22
            (pnpm.override {
              version = "10.6.1";
              hash = "sha256-gSBIRaOWliqcS0nMLWyvu0mnWGUtPCQ/ISjLxjgIT+I=";
            })
            zsh
          ];

          shellHook = ''
            ${prisma.shellHook}
            export VERCEL_ENV=development

            exec zsh
          '';
        };
      }
    );
}
